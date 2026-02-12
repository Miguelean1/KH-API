const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'El nombre del personaje es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  

  weapon: {
    type: String,
    default: 'Kingdom Key'
  },
  

  role: {
    type: String,
    enum: {
      values: ['Keyblade Wielder', 'Mage', 'Warrior', 'Support'],
      message: '{VALUE} no es un rol válido'
    },
    required: [true, 'El rol es obligatorio']
  },
  
  level: {
    type: Number,
    min: [1, 'El nivel mínimo es 1'],
    max: [100, 'El nivel máximo es 100'],
    default: 1
  },
  

  hp: {
    type: Number,
    required: [true, 'Los HP son obligatorios'],
    min: [10, 'Los HP mínimos son 10']
  },
  

  isAlive: {
    type: Boolean,
    default: true
  },
  

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Character', characterSchema);