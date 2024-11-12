using System.ComponentModel.DataAnnotations;

public class CreateMovieDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Summary { get; set; }
    public DateTime ReleaseDate { get; set; }
}