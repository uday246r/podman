using AssetManagementSystem.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace AssetManagementSystem.Api.DTOs;

public record AssetDto(
    int Id,
    string AssetName,
    string Category,
    string Brand,
    DateOnly PurchaseDate,
    AssetStatus Status);

public class AssetCreateDto
{
    [Required, MaxLength(120)]
    public string AssetName { get; set; } = string.Empty;

    [Required, MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(80)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    public DateOnly PurchaseDate { get; set; }

    [Required]
    public AssetStatus Status { get; set; } = AssetStatus.Available;
}

public class AssetUpdateDto : AssetCreateDto;
