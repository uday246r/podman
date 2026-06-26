using Microsoft.EntityFrameworkCore;
using ModuleRegistryApi.Models;

namespace ModuleRegistryApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Module> Modules => Set<Module>();
}