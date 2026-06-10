using System.ComponentModel.DataAnnotations;

namespace AssetManagementSystem.Api.DTOs;

public record EmployeeDto(int Id, string Name, string Email, string Department);

public class EmployeeCreateDto
{
    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(160)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Department { get; set; } = string.Empty;
}

public class EmployeeUpdateDto : EmployeeCreateDto;
