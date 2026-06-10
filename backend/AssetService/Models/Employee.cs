using System.ComponentModel.DataAnnotations;

namespace AssetManagementSystem.Api.Models;

public class Employee
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(160)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    public ICollection<Assignment> Assignments { get; set; } = [];
}
