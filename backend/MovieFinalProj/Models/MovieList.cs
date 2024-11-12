public class MovieList
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public User User { get; set; } = default!;
    public List<MovieListItem> Movies { get; set; } = new();
}