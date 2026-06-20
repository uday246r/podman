using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModuleRegistryApi.Migrations
{
    /// <inheritdoc />
    public partial class AddExposedModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExposedModule",
                table: "Modules",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExposedModule",
                table: "Modules");
        }
    }
}
