using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
public class AppDBContext : DbContext
{
    public DbSet<User> Users { get; set; } = default!;
    public DbSet<Movie> Movies { get; set; } = default!;
    public DbSet<Review> Reviews { get; set; } = default!;
    public DbSet<MovieList> MovieLists { get; set; } = default!;
    public DbSet<MovieListItem> MovieListItems { get; set; } = default!;

    public AppDBContext()
    {

    }
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Review>()
            .HasOne(r => r.Movie)
            .WithMany(m => m.Reviews)
            .HasForeignKey(r => r.MovieId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<MovieList>()
            .HasOne(ml => ml.User)
            .WithMany(u => u.MovieLists)
            .HasForeignKey(ml => ml.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<MovieListItem>()
            .HasOne(mli => mli.Movie)
            .WithMany(m => m.MovieListItems)
            .HasForeignKey(mli => mli.MovieId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<MovieListItem>()
            .HasOne(mli => mli.MovieList)
            .WithMany(ml => ml.Movies)
            .HasForeignKey(mli => mli.MovieListId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}