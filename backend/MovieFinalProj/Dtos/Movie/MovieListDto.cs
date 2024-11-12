public class MovieListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<MovieDto> Movies { get; set; } = new();
}
