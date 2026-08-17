using CelonExplore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CelonExplore.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Attraction> Attractions => Set<Attraction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --------------------------------------------------
        // User
        // --------------------------------------------------

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(150);

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.Password)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(x => x.Role)
                .HasConversion<string>()
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(x => x.IsActive)
                .IsRequired();
        });


        // --------------------------------------------------
        // Attraction
        // --------------------------------------------------

        modelBuilder.Entity<Attraction>(entity =>
        {
            entity.ToTable("Attractions");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Category)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Address)
                .IsRequired()
                .HasMaxLength(300);

            entity.Property(x => x.Description)
                .IsRequired();

            entity.Property(x => x.Latitude)
                .IsRequired();

            entity.Property(x => x.Longitude)
                .IsRequired();

            entity.Property(x => x.MainImageUrl)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(x => x.ImageUrls)
                .HasColumnType("text[]");

            entity.Property(x => x.IsActive)
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .IsRequired();

            entity.Property(x => x.UpdatedAt)
                .IsRequired();

            entity.HasIndex(x => x.Name);

            entity.HasIndex(x => x.Category);

            entity.HasIndex(x => x.Address);
        });
    }
}