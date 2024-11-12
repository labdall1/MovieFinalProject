
public class MovieListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public List<MovieListItemDto> Movies { get; set; } = new();
}