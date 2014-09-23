using System.Linq;
using AutoMapper;
using Todo.API.ViewModels;
using Todo.Model.Models;

namespace Todo.API.Mappers
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public override string ProfileName
        {
            get
            {
                return "DomainToViewModelMappingProfile";
            }
        }


        protected override void Configure()
        {
            Mapper.CreateMap<Company, CompanyViewModel>();
            Mapper.CreateMap<ApplicationUser, RegisterViewModel>();
            Mapper.CreateMap<ApplicationUser, UserViewModel>();
            Mapper.CreateMap<Schedule, ScheduleViewModel>();
            Mapper.CreateMap<Prospect, ProspectViewModel>();
            Mapper.CreateMap<Patient, PatientViewModel>();
            Mapper.CreateMap<Protocol, ProtocolViewModel>();
            Mapper.CreateMap<Practice, PracticeViewModel>();
            Mapper.CreateMap<Exam, ExamViewModel>();
            Mapper.CreateMap<State, StateViewModel>();
            Mapper.CreateMap<District, DistrictViewModel>();
            Mapper.CreateMap<Department, DepartmentViewModel>();
            Mapper.CreateMap<Triaje, TriajeViewModel>();
            Mapper.CreateMap<ExamPatient, ExamPatientViewModel>();
            Mapper.CreateMap<Form, FormViewModel>();
            Mapper.CreateMap<Country, CountryViewModel>();
            Mapper.CreateMap<Department, IdNameViewModel>();
            Mapper.CreateMap<State, IdNameViewModel>();
            Mapper.CreateMap<District, IdNameViewModel>();

        }
    }
}