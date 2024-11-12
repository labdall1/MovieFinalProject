public class ReviewDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserUsername { get; set; } = string.Empty;
    public int MovieId { get; set; }
}