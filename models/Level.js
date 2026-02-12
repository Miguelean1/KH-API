const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({

  worldName: {
    type: String,
    required: [true, 'El nombre del mundo es obligatorio'],
    maxlength: [50, 'El nombre del mundo no puede exceder 50 caracteres']
  },
  

  starsCollected: {
    type: Number,
    min: [0, 'No puedes tener estrellas negativas'],
    max: [99, 'El máximo de estrellas es 99'],
    default: 0
  },
  

  isCompleted: {
    type: Boolean,
    default: false
  },
  

  completedAt: {
    type: Date
  },
  

  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: [true, 'El personaje es obligatorio']
  }
});

module.exports = mongoose.model('Level', levelSchema);