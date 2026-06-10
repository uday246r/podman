using System.ComponentModel.DataAnnotations;

namespace AssetManagementSystem.Api.Models;

public class Asset
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string AssetName { get; set; } = string.Empty;

    [Required, MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(80)]
    public string Brand { get; set; } = string.Empty;

    public DateOnly PurchaseDate { get; set; }

    public AssetStatus Status { get; set; } = AssetStatus.Available;

    public ICollection<Assignment> Assignments { get; set; } = [];
}
