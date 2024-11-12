using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddDbContext<AppDBContext>(options =>
                options.UseSqlite($"Data Source={builder.Configuration.GetConnectionString("SqlLite")}"));
builder.Services.AddScoped<AuthService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Movies and Review Api", Version = "v1" });

    // Add security definition
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Add security requirement
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Configure middleware
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();



//Auth Endpoints
app.MapPost("/api/auth/register", async (RegisterRequest request, AuthService authService, AppDBContext db) =>
{
    // Validate request
    var validationContext = new ValidationContext(request);
    var validationResults = new List<ValidationResult>();
    if (!Validator.TryValidateObject(request, validationContext, validationResults, true))
    {
        return Results.ValidationProblem(
            validationResults.ToDictionary(
                vr => vr.MemberNames.First(),
                vr => new[] { vr.ErrorMessage ?? "Validation error" }
            )
        );
    }

    // Check if username is already taken
    if (await db.Users.AnyAsync(u => u.Username == request.Username))
    {
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            { "Username", new[] { "Username is already taken" } }
        });
    }

    // Check if email is already used (if provided)
    if (request.Email != null && await db.Users.AnyAsync(u => u.Email == request.Email))
    {
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            { "Email", new[] { "Email is already registered" } }
        });
    }

    // Create new user
    var user = new User
    {
        Username = request.Username,
        Email = request.Email,
        PasswordHash = authService.HashPassword(request.Password)
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    var token = authService.GenerateJwtToken(user);
    return Results.Ok(new AuthResponse(token, user.Username, user.Id));
})
.WithName("Register")
.WithOpenApi();

app.MapPost("/api/auth/login", async (LoginRequest request, AuthService authService, AppDBContext db) =>
{
    // Validate request
    var validationContext = new ValidationContext(request);
    var validationResults = new List<ValidationResult>();
    if (!Validator.TryValidateObject(request, validationContext, validationResults, true))
    {
        return Results.ValidationProblem(
            validationResults.ToDictionary(
                vr => vr.MemberNames.First(),
                vr => new[] { vr.ErrorMessage ?? "Validation error" }
            )
        );
    }

    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
    if (user == null)
    {
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            { "Username", new[] { "Invalid username or password" } }
        });
    }

    if (!authService.VerifyPassword(request.Password, user.PasswordHash))
    {
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            { "Password", new[] { "Invalid username or password" } }
        });
    }

    var token = authService.GenerateJwtToken(user);
    return Results.Ok(new AuthResponse(token, user.Username, user.Id));
})
.WithName("Login")
.WithOpenApi();

app.MapGet("/api/auth/me", async (HttpContext context, AppDBContext db) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var user = await db.Users
        .Where(u => u.Id == userId)
        .Select(u => new UserProfileResponse(u.Id, u.Username, u.Email, u.CreatedAt))
        .FirstOrDefaultAsync();

    return user == null ? Results.NotFound() : Results.Ok(user);
})
.RequireAuthorization()
.WithName("GetCurrentUser")
.WithOpenApi();




// Movie endpoints
app.MapGet("/api/movies", async (AppDBContext db) =>
{
    var movies = await db.Movies
        .Include(m => m.Reviews)
        .Select(m => new MovieDto
        {
            Id = m.Id,
            Title = m.Title,
            ImageUrl = m.ImageUrl,
            Summary = m.Summary,
            ReleaseDate = m.ReleaseDate,
            AverageRating = m.AverageRating,
            ReviewCount = m.Reviews.Count
        })
        .ToListAsync();

    return Results.Ok(movies);
})
.WithName("GetMovies")
.WithOpenApi();

app.MapGet("/api/movies/{id}", async (int id, AppDBContext db) =>
{
    var movie = await db.Movies
        .Include(m => m.Reviews)
        .ThenInclude(r => r.User)
        .FirstOrDefaultAsync(m => m.Id == id);

    if (movie == null) return Results.NotFound();

    var movieDetailDto = new MovieDetailDto
    {
        Id = movie.Id,
        Title = movie.Title,
        ImageUrl = movie.ImageUrl,
        Summary = movie.Summary,
        ReleaseDate = movie.ReleaseDate,
        AverageRating = movie.AverageRating,
        ReviewCount = movie.Reviews.Count,
        Reviews = movie.Reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            Content = r.Content,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt,
            UserUsername = r.User.Username
        }).ToList()
    };

    return Results.Ok(movieDetailDto);
})
.WithName("GetMovie")
.WithOpenApi();

app.MapPost("/api/movies", [Authorize] async (Movie movie, AppDBContext db) =>
{
    db.Movies.Add(movie);
    await db.SaveChangesAsync();

    var movieDto = new MovieDto
    {
        Id = movie.Id,
        Title = movie.Title,
        ImageUrl = movie.ImageUrl,
        Summary = movie.Summary,
        ReleaseDate = movie.ReleaseDate,
        AverageRating = 0,
        ReviewCount = 0
    };

    return Results.Created($"/api/movies/{movie.Id}", movieDto);
})
.WithName("CreateMovie")
.WithOpenApi();

// MovieList Endpoints
app.MapGet("/api/users/{userId}/lists", [Authorize] async (string userId, AppDBContext db) =>
{
    var lists = await db.MovieLists
        .Include(ml => ml.Movies)
        .ThenInclude(mli => mli.Movie)
        .Where(ml => ml.UserId == userId)
        .Select(ml => new MovieListDto
        {
            Id = ml.Id,
            Name = ml.Name,
            Movies = ml.Movies.Select(mli => new MovieDto
            {
                Id = mli.Movie.Id,
                Title = mli.Movie.Title,
                ImageUrl = mli.Movie.ImageUrl,
                Summary = mli.Movie.Summary,
                ReleaseDate = mli.Movie.ReleaseDate,
                AverageRating = mli.Movie.AverageRating,
                ReviewCount = mli.Movie.Reviews.Count
            }).ToList()
        })
        .ToListAsync();

    return Results.Ok(lists);
})
.WithName("GetUserLists")
.WithOpenApi();

app.MapPost("/api/lists", [Authorize] async (MovieList list, AppDBContext db, HttpContext context) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    list.UserId = userId;
    db.MovieLists.Add(list);
    await db.SaveChangesAsync();

    return Results.Created($"/api/lists/{list.Id}", new MovieListDto
    {
        Id = list.Id,
        Name = list.Name,
        Movies = new List<MovieDto>()
    });
})
.WithName("CreateList")
.WithOpenApi();

app.MapPost("/api/lists/{listId}/movies", [Authorize] async (int listId, int movieId, AppDBContext db, HttpContext context) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var list = await db.MovieLists.FindAsync(listId);
    if (list == null || list.UserId != userId) return Results.NotFound();

    var movie = await db.Movies.FindAsync(movieId);
    if (movie == null) return Results.NotFound();

    var movieListItem = new MovieListItem
    {
        MovieId = movieId,
        MovieListId = listId
    };

    db.MovieListItems.Add(movieListItem);
    await db.SaveChangesAsync();

    var movieDto = new MovieDto
    {
        Id = movie.Id,
        Title = movie.Title,
        ImageUrl = movie.ImageUrl,
        Summary = movie.Summary,
        ReleaseDate = movie.ReleaseDate,
        AverageRating = movie.AverageRating,
        ReviewCount = movie.Reviews.Count
    };

    return Results.Created($"/api/lists/{listId}/movies/{movieId}", movieDto);
})
.WithName("AddMovieToList")
.WithOpenApi();

// Search endpoint
app.MapGet("/api/movies/search", async (string query, AppDBContext db) =>
{
    var movies = await db.Movies
        .Where(m => m.Title.Contains(query))
        .Select(m => new MovieDto
        {
            Id = m.Id,
            Title = m.Title,
            ImageUrl = m.ImageUrl,
            Summary = m.Summary,
            ReleaseDate = m.ReleaseDate,
            AverageRating = m.AverageRating,
            ReviewCount = m.Reviews.Count
        })
        .Take(10)
        .ToListAsync();

    return Results.Ok(movies);
})
.WithName("SearchMovies")
.WithOpenApi();



app.MapPost("/api/movies/{movieId}/reviews", [Authorize] async (int movieId, Review review, AppDBContext db, HttpContext context) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    review.MovieId = movieId;
    review.UserId = userId;

    db.Reviews.Add(review);
    await db.SaveChangesAsync();

    var savedReview = await db.Reviews
        .Include(r => r.User)
        .FirstOrDefaultAsync(r => r.Id == review.Id);

    if (savedReview == null) return Results.BadRequest();

    var reviewDto = new ReviewDto
    {
        Id = savedReview.Id,
        Content = savedReview.Content,
        Rating = savedReview.Rating,
        CreatedAt = savedReview.CreatedAt,
        UserUsername = savedReview.User.Username
    };

    return Results.Created($"/api/reviews/{review.Id}", reviewDto);
})
.WithName("CreateReview")
.WithOpenApi();

app.MapPut("/api/movies/{movieId}/reviews/{reviewId}", [Authorize] async (int movieId, int reviewId, Review updatedReview, AppDBContext db, HttpContext context) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var existingReview = await db.Reviews
        .Include(r => r.User)
        .FirstOrDefaultAsync(r => r.Id == reviewId && r.MovieId == movieId);

    if (existingReview == null || existingReview.UserId != userId) return Results.NotFound();

    existingReview.Content = updatedReview.Content;
    existingReview.Rating = updatedReview.Rating;

    await db.SaveChangesAsync();

    var reviewDto = new ReviewDto
    {
        Id = existingReview.Id,
        Content = existingReview.Content,
        Rating = existingReview.Rating,
        CreatedAt = existingReview.CreatedAt,
        UserUsername = existingReview.User.Username
    };

    return Results.Ok(reviewDto);
})
.WithName("UpdateReview")
.WithOpenApi();

app.MapDelete("/api/movies/{movieId}/reviews/{reviewId}", [Authorize] async (int movieId, int reviewId, AppDBContext db, HttpContext context) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null) return Results.Unauthorized();

    var existingReview = await db.Reviews
        .Include(r => r.User)
        .FirstOrDefaultAsync(r => r.Id == reviewId && r.MovieId == movieId);

    if (existingReview == null || existingReview.UserId != userId) return Results.NotFound();

    db.Reviews.Remove(existingReview);
    await db.SaveChangesAsync();

    return Results.NoContent();
})
.WithName("DeleteReview")
.WithOpenApi();

app.Run();

