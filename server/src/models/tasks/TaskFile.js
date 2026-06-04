module.exports = (sequelize, DataTypes) => {
  const TaskFile = sequelize.define('TaskFile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    roadmapTaskId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'roadmap_task_id'
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'file_name'
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'file_url'
    },
    fileType: {
      type: DataTypes.STRING(100),
      field: 'file_type'
    },
    fileSizeBytes: {
      type: DataTypes.BIGINT,
      field: 'file_size_bytes'
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'uploaded_by'
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'uploaded_at'
    }
  }, {
    tableName: 'task_files',
    underscored: true,
    timestamps: false,
    indexes: [
      { fields: ['roadmap_task_id'] },
      { fields: ['uploaded_by'] }
    ]
  });

  TaskFile.associate = (models) => {
    TaskFile.belongsTo(models.RoadmapTask, { foreignKey: 'roadmap_task_id', as: 'roadmapTask' });
    TaskFile.belongsTo(models.User, { foreignKey: 'uploaded_by', as: 'uploader' });
  };

  return TaskFile;
};