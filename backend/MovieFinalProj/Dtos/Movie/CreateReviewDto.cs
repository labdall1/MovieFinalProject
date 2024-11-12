using System.ComponentModel.DataAnnotations;

public class CreateReviewDto
{
    [Required]
    [StringLength(1000, MinimumLength = 10)]
    public string Content { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }
}