public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Username { get; set; } = default!;
    public string? Email { get; set; }
    public string PasswordHash { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<MovieList> MovieLists { get; set; } = new();
    public List<Review> Reviews { get; set; } = new();
}