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
        var employeeModuleCreate = new AuthService.Models.Permission { ModuleName = "EmployeeModule", Action = "Create" };
        
        db.Permissions.AddRange(adminModuleView, employeeModuleView, employeeModuleCreate);
        db.SaveChanges();

        db.RolePermissions.AddRange(
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = adminModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = employeeModuleView.Id },
            new AuthService.Models.RolePermission { RoleId = adminRole.Id, PermissionId = employeeModuleCreate.Id },
            new AuthService.Models.RolePermission { RoleId = employeeRole.Id, PermissionId = employeeModuleView.Id }
        );
        db.SaveChanges();
    }

    if (!db.Users.Any())
    {
        var adminUser = new AuthService.Models.User { Email = "admin@gmail.com", Password = "password" };
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