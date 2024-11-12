public class AuthResponse
{
    public string Token { get; set; }
    public string Username { get; set; }
    public string UserId { get; set; }

    public AuthResponse(string token, string username, string userId)
    {
        Token = token;
        Username = username;
        UserId = userId;
    }
}