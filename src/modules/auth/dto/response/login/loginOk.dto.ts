import { ApiProperty } from "@nestjs/swagger";

export class LoginOkDto
{
    @ApiProperty({
        description: 'Mensaje de éxito',
        example: '1|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiYmYzOWE1MzYyMmYwYzA2ZjdjNWM3NmVkNGM1MDdjZTQ2NGNiYzlkNmQ4MzFkODRhYzgzNDMwYzk4YTZlN2M0YjBlMDZhOTUyZWQ0ZGZhYTM0OWJmZmIwYjJhZTgyNzk5N2JiYzU2NmVmNWUwYWQyNDBmMWI4OTllNjZkMmZiM2QyZmMzYmUxOTJhMThmZTU0ZWIyOWI5MGNlYjk4ZmI0ZGU1YjYwOTVmYTk1Y2Q2ZWIzZTg3NmQyNyIsImlhdCI6MTc1NzU0MTQzNiwiZXhwIjoxNzU3NTQ1MDM2fQ.WbvbjEYt_yqbk1UubNhAXsrlZuZifqJHqq-VHYVtPq0'
    })
    access_token:string;
}
