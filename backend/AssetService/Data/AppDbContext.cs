using AssetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementSystem.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Assignment> Assignments => Set<Assignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.Property(a => a.AssetName).HasMaxLength(120).IsRequired();
            entity.Property(a => a.Category).HasMaxLength(80).IsRequired();
            entity.Property(a => a.Brand).HasMaxLength(80).IsRequired();
            entity.Property(a => a.Status).HasConversion<string>().HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(120).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(160).IsRequired();
            entity.Property(e => e.Department).HasMaxLength(100).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasOne(a => a.Asset)
                .WithMany(a => a.Assignments)
                .HasForeignKey(a => a.AssetId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Employee)
                .WithMany(e => e.Assignments)
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => a.AssetId)
                .IsUnique()
                .HasFilter("\"ReturnedDate\" IS NULL");
        });
    }
}
