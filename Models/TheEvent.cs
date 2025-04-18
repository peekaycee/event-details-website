using System.ComponentModel.DataAnnotations;

namespace soft20181_starter.Models
{

    public class TheEvent
    {
        [Key] 
        public int Id { get; set; }

        [Required]
        [StringLength(100)] 
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required] 
        public string Location { get; set; } = string.Empty;

        [Display(Name = "Event Date and Time")]
        public DateTime EventDateTime { get; set; }

        [Display(Name = "Cover Photo")] public string CoverPhoto { get; set; } = string.Empty;


        // Optional: If you plan to link to AppUser
        // public string? UserId { get; set; }
        // public AppUser? User { get; set; }
    }
}
