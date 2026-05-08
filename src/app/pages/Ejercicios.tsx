import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { ScheduleModal } from '../components/ScheduleModal';

// 1. Importamos las imágenes (asegurate de tenerlas en esta ruta)
import imgBulgara from '../../assets/bulgara.jpeg';
import imgRodilla from '../../assets/rodilla.png';

// 2. Creamos el mapeo por ID para que sea fácil de mantener
const EXERCISE_IMAGES: Record<number, string> = {
  1: imgBulgara,
  2: imgRodilla,
  // Agregar los demás IDs
};

const filters = ['Todo', 'Rodilla', 'Tobillo', 'Muslo', 'Glúteo'];

const exerciseLibrary = [
  { id: 1, name: 'Sentadilla Búlgara', zone: 'Muslo' },
  { id: 2, name: 'Extensión de Rodilla', zone: 'Rodilla' },
  { id: 3, name: 'Puente de Glúteo', zone: 'Glúteo' },
  { id: 4, name: 'Zancada Frontal', zone: 'Muslo' },
  { id: 5, name: 'Elevación de Talón', zone: 'Tobillo' },
  { id: 6, name: 'Flexión de Cadera', zone: 'Muslo' },
  { id: 7, name: 'Rotación de Tobillo', zone: 'Tobillo' },
  { id: 8, name: 'Sentadilla Sumo', zone: 'Glúteo' },
  { id: 9, name: 'Step-Up', zone: 'Muslo' },
  { id: 10, name: 'Flexión de Rodilla', zone: 'Rodilla' },
  { id: 11, name: 'Abducción de Cadera', zone: 'Glúteo' },
  { id: 12, name: 'Plantar Flexion', zone: 'Tobillo' },
];

export function Ejercicios() {
  const [selectedFilter, setSelectedFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{ id: number; name: string } | null>(null);
  const navigate = useNavigate();
  const { colors } = useTheme();

  const filteredExercises = exerciseLibrary.filter((exercise) => {
    const matchesFilter =
      selectedFilter === 'Todo' || exercise.zone === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddToRoutine = (exercise: { id: number; name: string }) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {isModalOpen && selectedExercise && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          exerciseName={selectedExercise.name}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl mb-2" style={{ color: colors.primaryText, fontWeight: '700' }}>
          Biblioteca de Ejercicios
        </h2>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          Ejercicios especializados para rehabilitación de piernas
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search
          className="absolute left-5 top-1/2 transform -translate-y-1/2"
          size={22}
          style={{ color: colors.secondaryText }}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o zona..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 transition-all text-base"
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            color: colors.primaryText,
            '--tw-ring-color': '#00A896'
          } as React.CSSProperties}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className="px-6 py-3 rounded-full transition-all"
            style={{
              backgroundColor: selectedFilter === filter ? '#00A896' : colors.cardBg,
              color: selectedFilter === filter ? '#ffffff' : colors.primaryText,
              fontWeight: selectedFilter === filter ? '600' : '500',
              border: selectedFilter === filter ? 'none' : `1px solid ${colors.border}`
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-4 gap-6">
        {filteredExercises.map((exercise) => {
          const imageSrc = EXERCISE_IMAGES[exercise.id];

          return (
            <div
              key={exercise.id}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border"
              style={{ borderColor: colors.border }}
            >
              {/* Image Container */}
              <button
                onClick={() => navigate(`/ejercicios/${exercise.id}`)}
                className="w-full aspect-square relative flex items-center justify-center overflow-hidden"
                style={{ background: colors.navy }}
              >
                {imageSrc ? (
                  <>
                    <img 
                      src={imageSrc} 
                      alt={exercise.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Degradado para que el botón de '+' resalte */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </>
                ) : (
                  <p className="text-white/40 text-sm font-medium">Sin imagen</p>
                )}
              </button>

              {/* Green Add Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToRoutine(exercise);
                }}
                className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10"
                style={{ backgroundColor: '#28A745' }}
              >
                <Plus size={20} color="#ffffff" strokeWidth={3} />
              </button>

              {/* Exercise Info */}
              <div className="p-4" style={{ backgroundColor: colors.cardBg }}>
                <h3 className="font-semibold mb-1" style={{ color: colors.primaryText }}>
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00A896' }}></span>
                  <p className="text-sm" style={{ color: colors.secondaryText }}>{exercise.zone}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}