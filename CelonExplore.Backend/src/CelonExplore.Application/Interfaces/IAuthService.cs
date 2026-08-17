using CelonExplore.Application.DTOs.Auth;

namespace CelonExplore.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}