using AssetManagementSystem.Api.Data;
using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementSystem.Api.Services;

public class EmployeeService(AppDbContext context) : IEmployeeService
{
    public async Task<PagedResult<EmployeeDto>> GetAllAsync(string? search, int page, int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = context.Employees.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(e =>
                EF.Functions.ILike(e.Name, $"%{term}%") ||
                EF.Functions.ILike(e.Email, $"%{term}%"));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(e => e.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => ToDto(e))
            .ToListAsync();

        return new PagedResult<EmployeeDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        return await context.Employees
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => ToDto(e))
            .FirstOrDefaultAsync();
    }

    public async Task<EmployeeDto> CreateAsync(EmployeeCreateDto dto)
    {
        await EnsureEmailIsUnique(dto.Email);

        var employee = new Employee
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Department = dto.Department.Trim()
        };

        context.Employees.Add(employee);
        await context.SaveChangesAsync();
        return ToDto(employee);
    }

    public async Task<EmployeeDto?> UpdateAsync(int id, EmployeeUpdateDto dto)
    {
        var employee = await context.Employees.FindAsync(id);
        if (employee is null)
        {
            return null;
        }

        await EnsureEmailIsUnique(dto.Email, id);

        employee.Name = dto.Name.Trim();
        employee.Email = dto.Email.Trim().ToLowerInvariant();
        employee.Department = dto.Department.Trim();

        await context.SaveChangesAsync();
        return ToDto(employee);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await context.Employees.FindAsync(id);
        if (employee is null)
        {
            return false;
        }

        var hasAssignments = await context.Assignments.AnyAsync(a => a.EmployeeId == id);
        if (hasAssignments)
        {
            throw new InvalidOperationException("Cannot delete an employee that has assignment history.");
        }

        context.Employees.Remove(employee);
        await context.SaveChangesAsync();
        return true;
    }

    private async Task EnsureEmailIsUnique(string email, int? employeeId = null)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var exists = await context.Employees.AnyAsync(e => e.Email == normalized && e.Id != employeeId);
        if (exists)
        {
            throw new InvalidOperationException("An employee with this email already exists.");
        }
    }

    private static EmployeeDto ToDto(Employee employee) =>
        new(employee.Id, employee.Name, employee.Email, employee.Department);
}
