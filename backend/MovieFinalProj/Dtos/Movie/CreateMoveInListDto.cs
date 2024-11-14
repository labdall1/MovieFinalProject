using System.ComponentModel.DataAnnotations;

public class CreateMoveInListDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Summary { get; set; }
    public DateTime ReleaseDate { get; set; }
    public int ListId { get; set; }
}