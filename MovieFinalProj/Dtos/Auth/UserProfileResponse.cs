public class UserProfileResponse
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserProfileResponse(string id, string username, string? email, DateTime createdAt)
    {
        Id = id;
        Username = username;
        Email = email;
        CreatedAt = createdAt;
    }
}