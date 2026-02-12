const mongoose = require('mongoose');

const magicSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'El nombre de la magia es obligatorio'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  
  element: {
    type: String,
    enum: {
      values: ['Fire', 'Ice', 'Thunder', 'Cure', 'Gravity', 'Aero'],
      message: '{VALUE} no es un elemento válido'
    },
    required: [true, 'El elemento es obligatorio']
  },
  
  mpCost: {
    type: Number,
    min: [5, 'El coste mínimo de MP es 5'],
    max: [100, 'El coste máximo de MP es 100'],
    default: 10
  },
  
  isUnlocked: {
    type: Boolean,
    default: false
  },
  
  discoveredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Magic', magicSchema);