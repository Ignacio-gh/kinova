import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';

const filters = ['Todo', 'Hombro', 'Espalda', 'Rodilla', 'Pierna'];

const exerciseLibrary = [
  { id: 1, name: 'Sentadilla Búlgara', zone: 'Pierna' },
  { id: 2, name: 'Extensión de Rodilla', zone: 'Rodilla' },
  { id: 3, name: 'Puente de Glúteo', zone: 'Pierna' },
  { id: 4, name: 'Press de Hombro', zone: 'Hombro' },
  { id: 5, name: 'Elevación Lateral', zone: 'Hombro' },
  { id: 6, name: 'Remo con Banda', zone: 'Espalda' },
  { id: 7, name: 'Superman', zone: 'Espalda' },
  { id: 8, name: 'Zancada Frontal', zone: 'Pierna' },
];

export function Ejercicios() {
  const [selectedFilter, setSelectedFilter] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <main className="px-6 lg:px-8 py-6 lg:py-8 pb-8">
      {/* Title */}
      <h2 className="text-3xl lg:text-4xl mb-6 lg:mb-8" style={{ color: colors.primaryText, fontWeight: '700' }}>
        Ejercicios
      </h2>

      {/* Search Bar */}
      <div className="relative mb-6 lg:mb-8">
        <Search
          className="absolute left-4 lg:left-5 top-1/2 transform -translate-y-1/2 lg:w-6 lg:h-6"
          size={20}
          style={{ color: colors.secondaryText }}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o zona (pierna, hombro...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 lg:pl-14 pr-4 lg:pr-5 py-4 lg:py-5 rounded-2xl border focus:outline-none focus:ring-2 transition-all text-base lg:text-lg"
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            color: colors.primaryText,
            '--tw-ring-color': '#00A896'
          } as React.CSSProperties}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 lg:gap-3 mb-6 lg:mb-8 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className="flex-shrink-0 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full transition-all text-sm lg:text-base"
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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
        {filteredExercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => navigate(`/ejercicios/${exercise.id}`)}
            className="relative aspect-square rounded-2xl lg:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
          >
            {/* Background placeholder with gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #003d5c 0%, #002B49 100%)'
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute top-4 lg:top-6 right-4 lg:right-6 w-12 h-12 lg:w-16 lg:h-16 rounded-full opacity-30"
                style={{ backgroundColor: '#00A896' }}
              />
            </div>

            {/* Title Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-left mb-1 text-sm lg:text-base" style={{ fontWeight: '600' }}>
                {exercise.name}
              </h3>
              <p className="text-gray-300 text-xs lg:text-sm text-left">{exercise.zone}</p>
            </div>

            {/* Info Icon */}
            <div className="absolute top-3 lg:top-4 left-3 lg:left-4">
              <div className="p-1.5 lg:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Info size={16} className="lg:w-5 lg:h-5" color="#ffffff" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
