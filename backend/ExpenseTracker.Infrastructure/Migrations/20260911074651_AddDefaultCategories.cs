using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ExpenseTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DefaultCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefaultCategories", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "DefaultCategories",
                columns: new[] { "Id", "Name", "Type" },
                values: new object[,]
                {
                    { 1, "Salary", 0 },
                    { 2, "Freelance", 0 },
                    { 3, "Investments", 0 },
                    { 4, "Gifts", 0 },
                    { 5, "Other Income", 0 },
                    { 6, "Groceries", 1 },
                    { 7, "Rent", 1 },
                    { 8, "Utilities", 1 },
                    { 9, "Transportation", 1 },
                    { 10, "Dining Out", 1 },
                    { 11, "Entertainment", 1 },
                    { 12, "Health", 1 },
                    { 13, "Shopping", 1 },
                    { 14, "Subscriptions", 1 },
                    { 15, "Education", 1 },
                    { 16, "Insurance", 1 },
                    { 17, "Other Expense", 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DefaultCategories");
        }
    }
}
