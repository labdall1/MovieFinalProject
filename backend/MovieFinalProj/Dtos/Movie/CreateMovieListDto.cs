using System.ComponentModel.DataAnnotations;

public class CreateMovieListDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
}