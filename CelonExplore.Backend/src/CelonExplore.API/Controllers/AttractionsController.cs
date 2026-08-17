using CelonExplore.Application.DTOs.Attractions;
using CelonExplore.Infrastructure.Data;
using CelonExplore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CelonExplore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AttractionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AttractionsController(ApplicationDbContext context)
    {
        _context = context;
    }


    // ======================================================
    // GET: api/attractions
    // Search + Filter + Sort + Pagination
    // ======================================================

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? sortBy = "name",
        [FromQuery] string? sortOrder = "asc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 10;

        if (pageSize > 100)
            pageSize = 100;

        IQueryable<Attraction> query =
            _context.Attractions.AsNoTracking();


        // --------------------------------------------------
        // Search
        // --------------------------------------------------

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(x =>
                x.Name.ToLower().Contains(search.ToLower()) ||
                x.Category.ToLower().Contains(search.ToLower()) ||
                x.Address.ToLower().Contains(search.ToLower()));
        }


        // --------------------------------------------------
        // Category
        // --------------------------------------------------

        if (!string.IsNullOrWhiteSpace(category) &&
            category.ToLower() != "all")
        {
            query = query.Where(x =>
                x.Category.ToLower() == category.ToLower());
        }


        // --------------------------------------------------
        // Sorting
        // --------------------------------------------------

        var descending =
            sortOrder?.ToLower() == "desc";

        query = sortBy?.ToLower() switch
        {
            "category" =>
                descending
                    ? query.OrderByDescending(x => x.Category)
                    : query.OrderBy(x => x.Category),

            "location" =>
                descending
                    ? query.OrderByDescending(x => x.Address)
                    : query.OrderBy(x => x.Address),

            "createdat" =>
                descending
                    ? query.OrderByDescending(x => x.CreatedAt)
                    : query.OrderBy(x => x.CreatedAt),

            _ =>
                descending
                    ? query.OrderByDescending(x => x.Name)
                    : query.OrderBy(x => x.Name)
        };


        // --------------------------------------------------
        // Count
        // --------------------------------------------------

        var totalItems = await query.CountAsync();

        var totalPages =
            (int)Math.Ceiling(
                totalItems / (double)pageSize);


        // --------------------------------------------------
        // Pagination
        // --------------------------------------------------

        var attractions =
            await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new AttractionResponseDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Category = x.Category,
                    Address = x.Address,
                    Description = x.Description,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    MainImageUrl = x.MainImageUrl,
                    ImageUrls = x.ImageUrls,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .ToListAsync();


        return Ok(new
        {
            success = true,
            data = attractions,
            pagination = new
            {
                currentPage = page,
                pageSize,
                totalItems,
                totalPages
            }
        });
    }


    // ======================================================
    // GET: api/attractions/{id}
    // ======================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var attraction =
            await _context.Attractions
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

        if (attraction == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Attraction not found."
            });
        }

        return Ok(new AttractionResponseDto
        {
            Id = attraction.Id,
            Name = attraction.Name,
            Category = attraction.Category,
            Address = attraction.Address,
            Description = attraction.Description,
            Latitude = attraction.Latitude,
            Longitude = attraction.Longitude,
            MainImageUrl = attraction.MainImageUrl,
            ImageUrls = attraction.ImageUrls,
            IsActive = attraction.IsActive,
            CreatedAt = attraction.CreatedAt,
            UpdatedAt = attraction.UpdatedAt
        });
    }


    // ======================================================
    // POST: api/attractions
    // ======================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateAttractionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Attraction name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Category))
        {
            return BadRequest(new
            {
                success = false,
                message = "Category is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Address))
        {
            return BadRequest(new
            {
                success = false,
                message = "Address is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Description))
        {
            return BadRequest(new
            {
                success = false,
                message = "Description is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.MainImageUrl))
        {
            return BadRequest(new
            {
                success = false,
                message = "Main image URL is required."
            });
        }

        if (dto.Latitude < -90 || dto.Latitude > 90)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid latitude."
            });
        }

        if (dto.Longitude < -180 || dto.Longitude > 180)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid longitude."
            });
        }

        var attraction = new Attraction
        {
            Name = dto.Name.Trim(),
            Category = dto.Category.Trim(),
            Address = dto.Address.Trim(),
            Description = dto.Description.Trim(),
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            MainImageUrl = dto.MainImageUrl.Trim(),
            ImageUrls = dto.ImageUrls
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Take(5)
                .ToList(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Attractions.Add(attraction);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = attraction.Id },
            new
            {
                success = true,
                message = "Attraction created successfully.",
                data = attraction
            });
    }


    // ======================================================
    // PUT: api/attractions/{id}
    // ======================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateAttractionDto dto)
    {
        var attraction =
            await _context.Attractions
                .FirstOrDefaultAsync(x => x.Id == id);

        if (attraction == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Attraction not found."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new
            {
                success = false,
                message = "Attraction name is required."
            });
        }

        if (dto.Latitude < -90 || dto.Latitude > 90)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid latitude."
            });
        }

        if (dto.Longitude < -180 || dto.Longitude > 180)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid longitude."
            });
        }

        attraction.Name = dto.Name.Trim();
        attraction.Category = dto.Category.Trim();
        attraction.Address = dto.Address.Trim();
        attraction.Description = dto.Description.Trim();
        attraction.Latitude = dto.Latitude;
        attraction.Longitude = dto.Longitude;
        attraction.MainImageUrl = dto.MainImageUrl.Trim();

        attraction.ImageUrls = dto.ImageUrls
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Take(5)
            .ToList();

        attraction.IsActive = dto.IsActive;
        attraction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Attraction updated successfully.",
            data = attraction
        });
    }


    // ======================================================
    // DELETE: api/attractions/{id}
    // ======================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var attraction =
            await _context.Attractions
                .FirstOrDefaultAsync(x => x.Id == id);

        if (attraction == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Attraction not found."
            });
        }

        _context.Attractions.Remove(attraction);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Attraction deleted successfully."
        });
    }
}