using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AssetManagementSystem.Api.Migrations
{
    /// <inheritdoc />
    public partial class AutoIncrementGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Employees_EmployeeId",
                table: "Assignments");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_EmployeeId",
                table: "Assignments");

            // Remove old assignments data because int -> uuid conversion is impossible
            migrationBuilder.DropTable(
                name: "Assignments");

            // Change Id column from int identity to uuid
            // Drop identity/sequence and alter type safely
            migrationBuilder.Sql(@"
ALTER TABLE ""Assets"" ALTER COLUMN ""Id"" DROP IDENTITY IF EXISTS;
ALTER TABLE ""Assets"" ALTER COLUMN ""Id"" DROP DEFAULT;
DROP SEQUENCE IF EXISTS ""Assets_Id_seq"";
ALTER TABLE ""Assets"" ALTER COLUMN ""Id"" TYPE uuid USING gen_random_uuid();
ALTER TABLE ""Assets"" ALTER COLUMN ""Id"" SET DEFAULT gen_random_uuid();
");
// duplicate migration removed

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<Guid>(
                        type: "uuid",
                        nullable: false,
                        defaultValueSql: "gen_random_uuid()"),
                    Department = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false),
                    Email = table.Column<string>(
                        type: "character varying(160)",
                        maxLength: 160,
                        nullable: false),
                    Name = table.Column<string>(
                        type: "character varying(120)",
                        maxLength: 120,
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(
                        type: "uuid",
                        nullable: false,
                        defaultValueSql: "gen_random_uuid()"),
                    AssetId = table.Column<Guid>(
                        type: "uuid",
                        nullable: false),
                    EmployeeId = table.Column<Guid>(
                        type: "uuid",
                        nullable: false),
                    AssignedAt = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);

                    table.ForeignKey(
                        name: "FK_Assignments_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_EmployeeId",
                table: "Assignments",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "Assignments",
                type: "integer",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Assignments",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValueSql: "gen_random_uuid()")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Assets",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValueSql: "gen_random_uuid()")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            // Drop the Guid Employees table (created in Up) before recreating with int primary key
            migrationBuilder.DropTable(
                name: "Employees");
            // Recreate Employees table with int primary key
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Department = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_EmployeeId",
                table: "Assignments",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Employees_EmployeeId",
                table: "Assignments",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
