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


        return Ok(new
        {
            token =
                new JwtSecurityTokenHandler()
                    .WriteToken(token)
        });
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized();
        }

        var tokenStr = authHeader.Substring("Bearer ".Length).Trim();
        var handler = new JwtSecurityTokenHandler();
        
        if (!handler.CanReadToken(tokenStr))
        {
            return Unauthorized();
        }

        var jwtToken = handler.ReadJwtToken(tokenStr);
        var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(emailClaim))
        {
            return Unauthorized();
        }

        var user = _context.Users.FirstOrDefault(u => u.Email == emailClaim);
        if (user == null)
        {
            return Unauthorized();
        }

        var userRole = _context.UserRoles.FirstOrDefault(ur => ur.UserId == user.Id);
        var roleName = "admin"; // default fallback
        if (userRole != null)
        {
            var role = _context.Roles.FirstOrDefault(r => r.Id == userRole.RoleId);
            if (role != null)
            {
                roleName = role.Name;
            }
        }

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            role = roleName
        });
    }
}