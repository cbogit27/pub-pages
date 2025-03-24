const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      const result = await response.json();
      toast.success(result.message);
      refreshComments(); // Update UI
      
    } catch (error) {
      toast.error(error.message);
    }
  };