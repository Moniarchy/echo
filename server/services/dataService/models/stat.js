export default function statModel(thinky) {
  const {r, type: {string, date}} = thinky

  return {
    name: 'Stat',
    table: 'stats',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      descriptor: string()
        .allowNull(false)
        .default(true),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (Stat, models) => {
      Stat.hasMany(models.Question, 'questions', 'id', 'statId', {init: false})
    },
  }
}