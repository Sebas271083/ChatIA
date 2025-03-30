import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
  


const Chat = sequelize.define('Chat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false
   },
   apellido: {
    type: DataTypes.STRING(80),
    allowNull: false
   },
    role: {
       type: DataTypes.STRING(80),
       allowNull: false
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }, 
  });

  export default Chat
