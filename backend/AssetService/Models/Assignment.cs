namespace AssetManagementSystem.Api.Models;

public class Assignment
{
    public int Id { get; set; }
    public int AssetId { get; set; }
    public int EmployeeId { get; set; }
    public DateOnly AssignedDate { get; set; }
    public DateOnly? ReturnedDate { get; set; }

    public Asset? Asset { get; set; }
    public Employee? Employee { get; set; }
}
