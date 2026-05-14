import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AddPatientModal } from '../../components/AddPatientModal';
import type { PatientData } from '../../components/AddPatientModal';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  diagnosis: string;
  notes: string;
  status: 'active' | 'finished';
  lastSession: string;
  completionRate: number;
}

const initialPatients: Patient[] = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '+54 11 1234-5678',
    birthDate: '1985-03-15',
    diagnosis: 'Lesión de rodilla izquierda',
    notes: 'Post-operatorio, 3 semanas',
    status: 'active',
    lastSession: '2026-05-12',
    completionRate: 85
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria@email.com',
    phone: '+54 11 9876-5432',
    birthDate: '1990-07-22',
    diagnosis: 'Rehabilitación de tobillo',
    notes: 'Esguince grado 2',
    status: 'active',
    lastSession: '2026-05-11',
    completionRate: 92
  },
  {
    id: 3,
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '+54 11 5555-4444',
    birthDate: '1978-11-05',
    diagnosis: 'Fortalecimiento de cuádriceps',
    notes: 'Tratamiento completado exitosamente',
    status: 'finished',
    lastSession: '2026-04-28',
    completionRate: 100
  },
];

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [filter, setFilter] = useState<'all' | 'active' | 'finished'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleAddPatient = (data: PatientData) => {
    const newPatient: Patient = {
      id: patients.length + 1,
      ...data,
      status: 'active',
      lastSession: new Date().toISOString().split('T')[0],
      completionRate: 0
    };
    setPatients([...patients, newPatient]);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesFilter = filter === 'all' || patient.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPatient}
      />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl mb-2 font-bold" style={{ color: colors.primaryText }}>
            Mis Pacientes
          </h2>
          <p className="text-lg" style={{ color: colors.secondaryText }}>
            Gestiona y monitorea el progreso de tus pacientes
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:shadow-lg font-semibold"
          style={{ backgroundColor: '#00A896', color: '#ffffff' }}
        >
          <Plus size={20} />
          Agregar Paciente
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            size={20}
            style={{ color: colors.secondaryText }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o diagnóstico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              color: colors.primaryText,
              '--tw-ring-color': '#00A896'
            } as React.CSSProperties}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Activos' },
            { value: 'finished', label: 'Finalizados' }
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value as typeof filter)}
              className="px-5 py-3 rounded-xl transition-all font-medium"
              style={{
                backgroundColor: filter === filterOption.value ? '#00A896' : colors.cardBg,
                color: filter === filterOption.value ? '#ffffff' : colors.primaryText,
                border: filter === filterOption.value ? 'none' : `1px solid ${colors.border}`
              }}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <User size={48} className="mx-auto mb-4" style={{ color: colors.secondaryText }} />
            <p className="text-lg" style={{ color: colors.secondaryText }}>
              No se encontraron pacientes
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => navigate(`/kinesiologo/pacientes/${patient.id}`)}
              className="rounded-2xl p-6 border transition-all hover:shadow-lg text-left"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: patient.status === 'active' ? 'rgba(0, 168, 150, 0.1)' : 'rgba(107, 114, 128, 0.1)' }}
                  >
                    <User size={28} style={{ color: patient.status === 'active' ? '#00A896' : colors.secondaryText }} />
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold" style={{ color: colors.primaryText }}>
                        {patient.name}
                      </h3>
                      {patient.status === 'active' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}>
                          Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', color: colors.secondaryText }}>
                          Finalizado
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>
                      {patient.diagnosis}
                    </p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.secondaryText }}>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Última sesión: {new Date(patient.lastSession).toLocaleDateString('es-AR')}
                      </span>
                      <span>•</span>
                      <span>{patient.email}</span>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className="text-right">
                    <p className="text-3xl font-bold mb-1" style={{ color: patient.completionRate >= 80 ? '#28A745' : '#FFC107' }}>
                      {patient.completionRate}%
                    </p>
                    <p className="text-xs" style={{ color: colors.secondaryText }}>
                      Adherencia
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </main>
  );
}
