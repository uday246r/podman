using AuthService.Data;
using AuthService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    public class CreateUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public Guid RoleId { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { Message = "Email and Password are required." });
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { Message = "User with this email already exists." });
        }

        var role = await _context.Roles.FindAsync(request.RoleId);
        if (role == null)
        {
            return BadRequest(new { Message = "Invalid RoleId." });
        }

        var user = new User
        {
            Email = request.Email,
            Password = request.Password
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(); // Save to get the User Id

        var userRole = new UserRole
        {
            UserId = user.Id,
            RoleId = role.Id
        };

        _context.UserRoles.Add(userRole);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "User created successfully", UserId = user.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { Message = "User not found" });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        
        return Ok(new { Message = "User deleted successfully" });
    }
}
