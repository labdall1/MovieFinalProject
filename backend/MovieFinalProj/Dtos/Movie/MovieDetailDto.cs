public class MovieDetailDto : MovieDto
{
    public List<ReviewDto> Reviews { get; set; } = new();
}