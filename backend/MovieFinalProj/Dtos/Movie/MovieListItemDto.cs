public class MovieListItemDto
{
    public int Id { get; set; }
    public MovieDto Movie { get; set; } = null!;
    public DateTime AddedAt { get; set; }
}
