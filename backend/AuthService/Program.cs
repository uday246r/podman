using AuthService.Data;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(
    options =>
        options.UseNpgsql(
            builder.Configuration.GetConnectionString(
                "DefaultConnection"
            )
        )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseSwagger();

app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AuthService.Data.ApplicationDbContext>();
    db.Database.Migrate();

    if (!db.Roles.Any())
    {
        var adminRole = new AuthService.Models.Role { Name = "Admin", Description = "System Administrator" };
        var employeeRole = new AuthService.Models.Role { Name = "Employee", Description = "Standard Employee" };
        db.Roles.AddRange(adminRole, employeeRole);
        db.SaveChanges();

        var adminModuleView = new AuthService.Models.Permission { ModuleName = "AdminModule", Action = "View" };
        var employeeModuleView = new AuthService.Models.Permission { ModuleName = "EmployeeModule", Action = "View" };
        var inventoryModuleView = new AuthService.Models.Permission { ModuleName = "InventoryModule", Action = "View" };
        var helpdeskModuleView = new AuthService.Models.Permission { ModuleName = "HelpdeskModule", Action = "View" };
        var assetModuleView = new AuthService.Models.Permission { ModuleName = "AssetModule", Action = "View" };
        var maintenanceModuleView = new AuthService.Models.Permission { ModuleName = "MaintenanceModule", Action = "View" };
        var permissionModuleView = new AuthService.Models.Permission { ModuleName = "PermissionModule", Action = "View" };


        
        db.Permissions.AddRange(adminModuleView, employeeModuleView, inventoryModuleView, helpdeskModuleView, assetModuleView, permissionModuleView, maintenanceModuleView);
        db.SaveChanges();

        db.RolePermissions.AddRange(
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = adminModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = employeeModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = inventoryModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = helpdeskModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = assetModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = maintenanceModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = permissionModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = employeeRole.Id, PermissionId = employeeModuleView.Id }
        );

        db.ModuleStatuses.AddRange(
            new AuthService.Models.ModuleStatus { ModuleName="AdminModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" },
            new AuthService.Models.ModuleStatus { ModuleName="EmployeeModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" },
            new AuthService.Models.ModuleStatus { ModuleName="InventoryModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" },
            new AuthService.Models.ModuleStatus { ModuleName="AssetModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" },
            new AuthService.Models.ModuleStatus { ModuleName="HelpdeskModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" },
            new AuthService.Models.ModuleStatus { ModuleName="MaintenanceModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" },
            new AuthService.Models.ModuleStatus { ModuleName="PermissionModule" , IsEnabled=true, MaintenanceMessage="Module Under Maintenance" }
        );

        db.SaveChanges();
    }

    if (!db.Users.Any())
    {
        var adminUser = new AuthService.Models.User { Email = "admin@gmail.com", Password = "pass" };
        db.Users.Add(adminUser);
        db.SaveChanges();

        var adminRole = db.Roles.FirstOrDefault(r => r.Name == "Admin");
        if (adminRole != null)
        {
            db.UserRoles.Add(new AuthService.Models.UserRole { UserId = adminUser.Id, RoleId = adminRole.Id });
            db.SaveChanges();
        }
    }
}

app.Run();