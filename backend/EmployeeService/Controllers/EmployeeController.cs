using EmployeeService.Common;
using EmployeeService.DTOs.Requests;
using EmployeeService.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeService.Controllers;

[ApiController]
[Route("api/employees")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeesController(IEmployeeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _service.GetAllAsync();

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Employees fetched successfully",
            Data = employees
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateEmployee(
        CreateEmployeeRequest request)
    {
        var employee = await _service.CreateAsync(request);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Employee created successfully",
            Data = employee
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(
        Guid id, UpdateEmployeeRequest request)
    {
        var employee = await _service.UpdateAsync(id, request);
        if (employee == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Employee not found" });

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Employee updated successfully",
            Data = employee
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(Guid id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound(new ApiResponse<object> { Success = false, Message = "Employee not found" });

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Employee deleted successfully"
        });
    }
}