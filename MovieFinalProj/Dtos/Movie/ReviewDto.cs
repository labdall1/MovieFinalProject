public class ReviewDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserUsername { get; set; } = string.Empty;
}