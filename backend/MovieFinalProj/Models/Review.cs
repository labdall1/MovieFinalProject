public class Review
{
    public int Id { get; set; }
    public string Content { get; set; } = default!;
    public int Rating { get; set; }  // 1-5 stars
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = default!;
    public User User { get; set; } = default!;
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = default!;
}