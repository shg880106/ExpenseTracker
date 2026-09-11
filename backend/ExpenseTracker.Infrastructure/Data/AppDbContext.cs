using ExpenseTracker.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseTracker.Infrastructure.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<DefaultCategory> DefaultCategories => Set<DefaultCategory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Category>()
            .HasOne(c => c.User)
            .WithMany(u => u.Categories)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .OnDelete(DeleteBehavior.Restrict); 

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.User)
            .WithMany(u => u.Transactions)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DefaultCategory>().HasData(
            new DefaultCategory { Id = 1, Name = "Salary", Type = TransactionType.Income },
            new DefaultCategory { Id = 2, Name = "Freelance", Type = TransactionType.Income },
            new DefaultCategory { Id = 3, Name = "Investments", Type = TransactionType.Income },
            new DefaultCategory { Id = 4, Name = "Gifts", Type = TransactionType.Income },
            new DefaultCategory { Id = 5, Name = "Other Income", Type = TransactionType.Income },
            new DefaultCategory { Id = 6, Name = "Groceries", Type = TransactionType.Expense },
            new DefaultCategory { Id = 7, Name = "Rent", Type = TransactionType.Expense },
            new DefaultCategory { Id = 8, Name = "Utilities", Type = TransactionType.Expense },
            new DefaultCategory { Id = 9, Name = "Transportation", Type = TransactionType.Expense },
            new DefaultCategory { Id = 10, Name = "Dining Out", Type = TransactionType.Expense },
            new DefaultCategory { Id = 11, Name = "Entertainment", Type = TransactionType.Expense },
            new DefaultCategory { Id = 12, Name = "Health", Type = TransactionType.Expense },
            new DefaultCategory { Id = 13, Name = "Shopping", Type = TransactionType.Expense },
            new DefaultCategory { Id = 14, Name = "Subscriptions", Type = TransactionType.Expense },
            new DefaultCategory { Id = 15, Name = "Education", Type = TransactionType.Expense },
            new DefaultCategory { Id = 16, Name = "Insurance", Type = TransactionType.Expense },
            new DefaultCategory { Id = 17, Name = "Other Expense", Type = TransactionType.Expense }
        );
    }
}
