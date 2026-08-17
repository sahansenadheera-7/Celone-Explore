using CelonExplore.Application.DTOs.Auth;
using CelonExplore.Application.Interfaces;
using CelonExplore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CelonExplore.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;

    public AuthService(
        ApplicationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> LoginAsync(
        LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Email and password are required."
            };
        }

        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Email.ToLower() == email);

        if (user == null)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        if (!user.IsActive)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "This account is inactive."
            };
        }

        // Dummy authentication for development only.
        if (user.Password != request.Password)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Success = true,
            Message = "Login successful.",
            Token = token,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
}