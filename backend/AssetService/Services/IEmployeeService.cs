using AssetManagementSystem.Api.DTOs;

namespace AssetManagementSystem.Api.Services;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeDto>> GetAllAsync(string? search, int page, int pageSize);
    Task<EmployeeDto?> GetByIdAsync(int id);
    Task<EmployeeDto> CreateAsync(EmployeeCreateDto dto);
    Task<EmployeeDto?> UpdateAsync(int id, EmployeeUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
