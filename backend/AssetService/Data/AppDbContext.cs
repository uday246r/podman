using AssetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementSystem.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Assignment> Assignments => Set<Assignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.Property(a => a.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(a => a.AssetName).HasMaxLength(120).IsRequired();
            entity.Property(a => a.Category).HasMaxLength(80).IsRequired();
            entity.Property(a => a.Brand).HasMaxLength(80).IsRequired();
            entity.Property(a => a.Status).HasConversion<string>().HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.Property(a => a.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.HasOne(a => a.Asset)
                .WithMany(a => a.Assignments)
                .HasForeignKey(a => a.AssetId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => a.AssetId)
                .IsUnique()
                .HasFilter("\"ReturnedDate\" IS NULL");
        });
    }
}
