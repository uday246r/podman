using AuthService.Data;
using AuthService.Models;

using Microsoft.AspNetCore.Mvc;

using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;

using System.Security.Claims;

using System.Text;

namespace AuthService.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    private readonly ApplicationDbContext _context;

    public AuthController(
        IConfiguration configuration,
        ApplicationDbContext context
    )
    {
        _configuration = configuration;
        _context = context;
    }

    [HttpPost("login")]

    public IActionResult Login(User request)
    {
        
        var user = _context.Users.FirstOrDefault(
            x =>
                x.Email == request.Email
                && x.Password == request.Password
        );

        if (user == null)
        {
            return Unauthorized();
        }

        var claims = new[]
        {
            new Claim(
                ClaimTypes.Email,
                user.Email
            )
        };

        var keyString = _configuration["Jwt:Key"] ?? string.Empty;
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(keyString)
        );

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience:
                _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(5),
            signingCredentials: creds
        );

Console.WriteLine(
    "......................reached here..........................."
);
        return Ok(new
        {
            token =
                new JwtSecurityTokenHandler()
                    .WriteToken(token)
        });
    }
}