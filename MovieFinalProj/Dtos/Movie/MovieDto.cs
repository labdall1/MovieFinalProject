public class MovieDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Summary { get; set; }
    public DateTime ReleaseDate { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}